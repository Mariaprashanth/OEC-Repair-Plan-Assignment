
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using RL.Backend.Controllers;
using RL.Data;
using RL.Data.DataModels;

namespace RL.Backend.UnitTests;

[TestClass]
public class PlanProcedureControllerTests
{
    private static async Task<RLContext> CreateTestContext()
    {
        var context = DbContextHelper.CreateContext();

        context.Plans.Add(new Plan
        {
            PlanId = 1
        });

        context.Procedures.Add(new Procedure
        {
            ProcedureId = 1,
            ProcedureTitle = "Test Procedure"
        });

        context.PlanProcedures.Add(new PlanProcedure
        {
            PlanId = 1,
            ProcedureId = 1
        });

        context.Users.AddRange(
            new User { UserId = 1, Name = "User One" },
            new User { UserId = 2, Name = "User Two" },
            new User { UserId = 3, Name = "User Three" }
        );

        await context.SaveChangesAsync();

        return context;
    }

    private static PlanProcedureController CreateController(
        RLContext context)
    {
        var logger = new Mock<ILogger<PlanProcedureController>>();

        return new PlanProcedureController(logger.Object, context);
    }

    [TestMethod]
    public async Task AssignUsers_ValidUsers_ReturnsOk()
    {
        var context = await CreateTestContext();
        var controller = CreateController(context);

        var result = await controller.AssignUsers(
            1, 1, new List<int> { 1, 2 });

        result.Should().BeOfType<OkObjectResult>();

        var assignments = context.PlanProcedureUsers.ToList();

        assignments.Should().HaveCount(2);
        assignments.Select(x => x.UserId)
            .Should().BeEquivalentTo(new[] { 1, 2 });
    }

    [TestMethod]
    public async Task AssignUsers_DuplicateUserIds_AssignsUniqueUsers()
    {
        var context = await CreateTestContext();
        var controller = CreateController(context);

        var result = await controller.AssignUsers(
            1, 1, new List<int> { 1, 1, 2, 2 });

        result.Should().BeOfType<OkObjectResult>();

        var assignments = context.PlanProcedureUsers.ToList();

        assignments.Should().HaveCount(2);
        assignments.Select(x => x.UserId)
            .Should().BeEquivalentTo(new[] { 1, 2 });
    }

    [TestMethod]
    public async Task AssignUsers_InvalidUserId_ReturnsBadRequest()
    {
        var context = await CreateTestContext();
        var controller = CreateController(context);

        var result = await controller.AssignUsers(
            1, 1, new List<int> { 1, 999 });

        result.Should().BeOfType<BadRequestObjectResult>();
        context.PlanProcedureUsers.Should().BeEmpty();
    }

    [TestMethod]
    public async Task AssignUsers_MissingPlanProcedure_ReturnsNotFound()
    {
        var context = await CreateTestContext();
        var controller = CreateController(context);

        var result = await controller.AssignUsers(
            99, 99, new List<int> { 1 });

        result.Should().BeOfType<NotFoundObjectResult>();
        context.PlanProcedureUsers.Should().BeEmpty();
    }

    [TestMethod]
    public async Task RemoveUser_ExistingAssignment_RemovesUser()
    {
        var context = await CreateTestContext();

        context.PlanProcedureUsers.AddRange(
            new PlanProcedureUser
            {
                PlanId = 1,
                ProcedureId = 1,
                UserId = 1
            },
            new PlanProcedureUser
            {
                PlanId = 1,
                ProcedureId = 1,
                UserId = 2
            }
        );

        await context.SaveChangesAsync();

        var controller = CreateController(context);

        var result = await controller.RemoveUser(1, 1, 1);

        result.Should().BeOfType<OkObjectResult>();

        var assignments = context.PlanProcedureUsers.ToList();

        assignments.Should().ContainSingle();
        assignments[0].UserId.Should().Be(2);
    }

    [TestMethod]
    public async Task RemoveAllUsers_ExistingAssignments_RemovesAllUsers()
    {
        var context = await CreateTestContext();

        context.PlanProcedureUsers.AddRange(
            new PlanProcedureUser
            {
                PlanId = 1,
                ProcedureId = 1,
                UserId = 1
            },
            new PlanProcedureUser
            {
                PlanId = 1,
                ProcedureId = 1,
                UserId = 2
            }
        );

        await context.SaveChangesAsync();

        var controller = CreateController(context);

        var result = await controller.RemoveAllUsers(1, 1);

        result.Should().BeOfType<OkObjectResult>();
        context.PlanProcedureUsers.Should().BeEmpty();
    }

    [TestMethod]
    public async Task AssignUsers_EmptyUserList_RemovesAllAssignments()
    {
        var context = await CreateTestContext();

        context.PlanProcedureUsers.AddRange(
            new PlanProcedureUser
            {
                PlanId = 1,
                ProcedureId = 1,
                UserId = 1
            },
            new PlanProcedureUser
            {
                PlanId = 1,
                ProcedureId = 1,
                UserId = 2
            }
        );

        await context.SaveChangesAsync();

        var controller = CreateController(context);

        var result = await controller.AssignUsers(
            1, 1, new List<int>());

        result.Should().BeOfType<OkObjectResult>();
        context.PlanProcedureUsers.Should().BeEmpty();
    }
}
