namespace redington.calculation.api.test;

using Alba;

public class ApiTests
{
    [Fact]
    public async Task CombinedWithEndpointReturnsOkStatus()
    {
        var host = await AlbaHost.For<global::Program>(x => {});
        
        await host.Scenario(_ =>
        {
            _.Get.Url("/CombinedWith?probabilityA=0.5&probabilityB=0.5");
            _.StatusCodeShouldBeOk();
        });
    }
}
