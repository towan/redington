namespace redington.calculation.api.test;

using Alba;
using System.Net;

public class ApiTests
{
    [Fact]
    public async Task CombinedWithEndpointReturnsOkStatus()
    {
        var host = await AlbaHost.For<global::Program>(x => { });

        await host.Scenario(_ =>
        {
            _.Get.Url("/CombinedWith?probabilityA=0.5&probabilityB=0.5");
            _.StatusCodeShouldBeOk();
            _.ContentShouldContain("0.25");
        });
    }

    [Fact]
    public async Task CombinedWithEndpointWhenValidationFails()
    {
        var host = await AlbaHost.For<global::Program>(x => { });

        await host.Scenario(_ =>
        {
            _.Get.Url("/CombinedWith?probabilityA=1.5&probabilityB=0.5");
            _.StatusCodeShouldBe(HttpStatusCode.BadRequest);
            _.ContentShouldContain("The value of pa must be between 0.0 and 1.0 inclusive.");
        });

    }

    [Fact]
    public async Task EitherEndpointReturnsOkStatus()
    {
        var host = await AlbaHost.For<global::Program>(x => { });

        await host.Scenario(_ =>
        {
            _.Get.Url("/Either?probabilityA=0.5&probabilityB=0.5");
            _.StatusCodeShouldBeOk();
            _.ContentShouldContain("0.75");
        });
    }

    [Fact]
    public async Task EitherEndpointWhenValidationFails()
    {
        var host = await AlbaHost.For<global::Program>(x => { });

        await host.Scenario(_ =>
        {
            _.Get.Url("/Either?probabilityA=1.5&probabilityB=0.5");
            _.StatusCodeShouldBe(HttpStatusCode.BadRequest);
            _.ContentShouldContain("The value of pa must be between 0.0 and 1.0 inclusive.");
        });
    }
    
    
}
