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
        var (isValid,message) = ValidateParameters(pa, pb);
        if (!isValid)
            return new CalculationResult(null,false,message);

        return new CalculationResult(pa * pb, true, null);
    }

    /// <summary>
    /// Calculates the probability of either of two independent events occurring.
    /// </summary>
    /// <param name="pa">The probability of event A (must be between 0.0 and 1.0).</param>
    /// <param name="pb">The probability of event B (must be between 0.0 and 1.0).</param>
    /// <returns>
    /// A <see cref="CalculationResult"/> containing the probability of either event occurring if both inputs are valid; otherwise, a result indicating failure.
    /// </returns>
    public static CalculationResult Either(double pa, double pb)
    {
        var (isValid,message) = ValidateParameters(pa, pb);
        if (!isValid)
            return new CalculationResult(null,false,message);

        return new CalculationResult(((pa + pb) - (pa * pb)), true, null);
    }

    private static (bool,string) ValidateParameters(double pa, double pb)
    {
        if (pa < ProbabilityMin || pa > ProbabilityMax)
            return (false, "The value of pa must be between 0.0 and 1.0 inclusive.");
        if (pb < ProbabilityMin || pb > ProbabilityMax)
            return (false, "The value of pb must be between 0.0 and 1.0 inclusive.");
        return null;
    }
}

