using System.Security.Cryptography;
using redington.calculation;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/CombinedWith", (double probabilityA, double probabilityB) =>
{
    var result = ProbabilityCalculator.CombinedWith(probabilityA, probabilityB);

    if (!result.Success)
    {
        return Results.BadRequest(result.ValidationFailureMessage);    
    }

    return Results.Ok(result);
});

app.MapGet("/Either", (double probabilityA, double probabilityB) =>
{
    var result = ProbabilityCalculator.Either(probabilityA, probabilityB);

    if (!result.Success)
    {
        return Results.BadRequest(result.ValidationFailureMessage);    
    }

    return Results.Ok(result);
});
app.Run();



