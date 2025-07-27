using System.Security.Cryptography;
using static redington.calculation.ProbabilityCalculator;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSerilog(l =>
{
    l.WriteTo.File(
        path: "api-.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}"
    );
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/CombinedWith", static (ILogger<Program> logger, double probabilityA, double probabilityB) =>
{
    var result = CombinedWith(probabilityA, probabilityB);

    if (!result.Success)
    {
        logger.LogInformation($"CombinedWith request failed. A {probabilityA}, B {probabilityB}. Reason: {result.ValidationFailureMessage}");
        return Results.BadRequest(result.ValidationFailureMessage);
    }

    logger.LogInformation($"CombinedWith request successfully handled. A {probabilityA}, B {probabilityB}, Result {result.Result}");

    return Results.Ok(result);
});


app.MapGet("/Either", (ILogger<Program> logger,double probabilityA, double probabilityB) =>
{
    var result = Either(probabilityA, probabilityB);

    if (!result.Success)
    {
        logger.LogInformation($"Either request failed. A {probabilityA}, B {probabilityB}. Reason: {result.ValidationFailureMessage}");
        return Results.BadRequest(result.ValidationFailureMessage);
    }

    logger.LogInformation($"Either request successfully handled. A {probabilityA}, B {probabilityB}, Result {result.Result}");

    return Results.Ok(result);
});

app.Run();
