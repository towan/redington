using FluentAssertions;

namespace redington.calculation.test;

public class EitherTests
{
    //Either: P(A) + P(B) – P(A)P(B) e.g. 0.5 + 0.5 – 0.5*0.5 = 0.75
    [Fact]
    public void ValidateEitherFunction()
    {
        var result = ProbabilityCalculator.Either(0.5, 0.5);

        result.Success.Should().BeTrue();
        result.Result.Should().Be(0.75);
    }

    [Theory]
    [InlineData(0.5, 0.5, true)]
    [InlineData(1.1, 0.5, false)]
    [InlineData(0.5, 1.1, false)]
    [InlineData(-0.1, 0.5, false)]
    [InlineData(0.5, -0.1, false)]
    [InlineData(-0.1, -0.1, false)]
    [InlineData(1.1, 1.1, false)]
    public void ValidateParameters(double pa, double pb, bool expected)
    {
        var result = ProbabilityCalculator.Either(pa, pb);
        result.Success.Should().Be(expected);
    }

    [Theory]
    [InlineData(0.5, 0.5, null)]
    [InlineData(1.1, 0.5, "The value of pa must be between 0.0 and 1.0 inclusive.")]
    [InlineData(0.5, 1.1, "The value of pb must be between 0.0 and 1.0 inclusive.")]
    [InlineData(-0.1, 0.5, "The value of pa must be between 0.0 and 1.0 inclusive.")]
    [InlineData(0.5, -0.1, "The value of pb must be between 0.0 and 1.0 inclusive.")]
    public void CheckValidationFailureMessages(double pa, double pb, string? expected)
    {
        var result = ProbabilityCalculator.CombinedWith(pa, pb);
        result.ValidationFailureMessage.Should().Be(expected);
    }
}
