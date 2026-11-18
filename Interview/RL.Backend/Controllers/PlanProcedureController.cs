
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.EntityFrameworkCore;
using RL.Data;
using RL.Data.DataModels;

namespace RL.Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class PlanProcedureController : ControllerBase
{
    private readonly ILogger<PlanProcedureController> _logger;
    private readonly RLContext _context;

    public PlanProcedureController(
        ILogger<PlanProcedureController> logger,
        RLContext context)
    {
        _logger = logger;
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    [HttpGet]
    [EnableQuery]
    public IEnumerable<PlanProcedure> Get()
    {
        return _context.PlanProcedures;
    }

    // Get assigned users
    [HttpGet("{planId:int}/{procedureId:int}/users")]
    public async Task<IActionResult> GetAssignedUsers(int planId, int procedureId)
    {
        var users = await _context.PlanProcedureUsers
            .Where(x => x.PlanId == planId &&
                        x.ProcedureId == procedureId)
            .Select(x => new
            {
                x.User.UserId,
                x.User.Name
            })
            .ToListAsync();

        return Ok(users);
    }

    // Assign or update users
    [HttpPut("{planId:int}/{procedureId:int}/users")]
    public async Task<IActionResult> AssignUsers(
        int planId,
        int procedureId,
        [FromBody] List<int> userIds)
    {
        var planProcedure = await _context.PlanProcedures
            .AnyAsync(x => x.PlanId == planId &&
                           x.ProcedureId == procedureId);

        if (!planProcedure)
            return NotFound("Plan procedure not found.");

        userIds = userIds?.Distinct().ToList() ?? new List<int>();

        var validUserCount = await _context.Users
            .CountAsync(x => userIds.Contains(x.UserId));

        if (validUserCount != userIds.Count)
            return BadRequest("One or more users are invalid.");

        var existingAssignments = await _context.PlanProcedureUsers
            .Where(x => x.PlanId == planId &&
                        x.ProcedureId == procedureId)
            .ToListAsync();

        _context.PlanProcedureUsers.RemoveRange(existingAssignments);

        foreach (var userId in userIds)
        {
            _context.PlanProcedureUsers.Add(new PlanProcedureUser
            {
                PlanId = planId,
                ProcedureId = procedureId,
                UserId = userId
            });
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Users assigned successfully." });
    }

    // Remove one user
    [HttpDelete("{planId:int}/{procedureId:int}/users/{userId:int}")]
    public async Task<IActionResult> RemoveUser(
        int planId,
        int procedureId,
        int userId)
    {
        var assignment = await _context.PlanProcedureUsers
            .FirstOrDefaultAsync(x =>
                x.PlanId == planId &&
                x.ProcedureId == procedureId &&
                x.UserId == userId);

        if (assignment == null)
            return NotFound("User assignment not found.");

        _context.PlanProcedureUsers.Remove(assignment);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User removed successfully." });
    }

    // Remove all users
    [HttpDelete("{planId:int}/{procedureId:int}/users")]
    public async Task<IActionResult> RemoveAllUsers(
        int planId,
        int procedureId)
    {
        var assignments = await _context.PlanProcedureUsers
            .Where(x => x.PlanId == planId &&
                        x.ProcedureId == procedureId)
            .ToListAsync();

        _context.PlanProcedureUsers.RemoveRange(assignments);
        await _context.SaveChangesAsync();

        return Ok(new { message = "All users removed successfully." });
    }
}
