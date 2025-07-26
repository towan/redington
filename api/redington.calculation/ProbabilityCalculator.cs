

namespace redington.calculation;

public static class ProbabilityCalculator
{
    private const double ProbabilityMin = 0.0;
    private const double ProbabilityMax = 1.0;

    /// <summary>
    /// Calculates the combined probability of two independent events occurring together.
    /// </summary>
    /// <param name="pa">The probability of event A (must be between 0.0 and 1.0).</param>
    /// <param name="pb">The probability of event B (must be between 0.0 and 1.0).</param>
    /// <returns>
    /// A <see cref="CalculationResult"/> containing the combined probability if both inputs are valid; otherwise, a result indicating failure.
    /// </returns>
    public static CalculationResult CombinedWith(double pa, double pb)
    {
        return (pa, pb) switch
        {
            var (a, b) when a > ProbabilityMax => new CalculationResult(null, false, "A pa value greater than 1.0 is invalid"),
            var (a, b) when b > ProbabilityMax => new CalculationResult(null, false, "A pb value greater than 1.0 is invalid"),
            var (a, b) when a < ProbabilityMin => new CalculationResult(null, false, "A pa value less than 0 is invalid"),
            var (a, b) when b < ProbabilityMin => new CalculationResult(null, false, "A pb value less than 0 is invalid"),
            _ => new CalculationResult((pa * pb), true, null)
        };
    }

    public static CalculationResult Either(double pa, double pb)
    {
        return (pa, pb) switch
        {
            var (a, b) when a > ProbabilityMax => new CalculationResult(null, false, "A pa value greater than 1.0 is invalid"),
            var (a, b) when b > ProbabilityMax => new CalculationResult(null, false, "A pb value greater than 1.0 is invalid"),
            var (a, b) when a < ProbabilityMin => new CalculationResult(null, false, "A pa value less than 0 is invalid"),
            var (a, b) when b < ProbabilityMin => new CalculationResult(null, false, "A pb value less than 0 is invalid"),
            _ => new CalculationResult(((pa + pb) - (pa * pb)), true, null)
        };
    }
}

