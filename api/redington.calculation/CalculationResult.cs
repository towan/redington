
namespace redington.calculation;

/// <summary>
/// Prefer 'result object' pattern over null objects in the event of error,
/// the caller of the function always gets a result
/// </summary>
/// <param name="Result"></param>
/// <param name="Success"></param>
public record CalculationResult(double? Result, bool Success);


