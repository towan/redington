
namespace redington.calculation;



/// <summary>
/// ProbabilityCalculator 
/// Calculations are 'pure' functions so can be defined as static
/// </summary>
public static class ProbabilityCalculator
{
    public static CalculationResult CombinedWith(double pa, double pb)
    {
        if (pa > 1.0 || pb > 1.0 || pa < 0 || pb < 0) return new CalculationResult(null, false);
        var result = pa * pb;
        return new CalculationResult(result,true);
    }
}

