
namespace redington.calculation;

/// <summary>
/// Calculates the combined probability of two independent events occurring together.
/// </summary>
/// <param name="pa">The probability of event A (must be between 0.0 and 1.0).</param>
/// <param name="pb">The probability of event B (must be between 0.0 and 1.0).</param>
/// <returns>
/// A <see cref="CalculationResult"/> containing the combined probability if both inputs are valid; otherwise, a result indicating failure.
/// </returns>
public static class ProbabilityCalculator
{
    private const double ProbabilityMin = 0.0;
    private const double ProbabilityMax = 1.0;

    public static CalculationResult CombinedWith(double pa, double pb)
    {
        if (pa > ProbabilityMax || pb > ProbabilityMax || pa < ProbabilityMin || pb < ProbabilityMin)
        {
            return new CalculationResult(null, false);
        }
        var result = pa * pb;
        return new CalculationResult(result, true);
    }
}

