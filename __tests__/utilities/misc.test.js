import { formatUrl } from "../../src/utility/misc";

describe("Miscellaneous component tests", ()=>{
    it("Properly formats an input url with the provided query parameters and dynamic content values => formatUrl()", ()=>{
        //Test ensures that the same url is returned if none/null parameters are provided
        let myUrl = "http://www.mydomain.com/test";
        let formatedUrl= formatUrl(myUrl, null, null);
        expect(myUrl).toEqual(formatedUrl)

        //Test ensures that a single query name parameter is properly formatted
        let query = {"name":"test_name"}
        let expectedUrl = "http://www.mydomain.com/test?name=test_name"
        formatedUrl = formatUrl(myUrl, query);
        expect(formatedUrl).toEqual(expectedUrl);

        //Test ensures that multiple query strings are properly formatted.
        query = {"name":"test_name", "another":"another_value"};
        expectedUrl = "http://www.mydomain.com/test?name=test_name&another=another_value";
        formatedUrl = formatUrl(myUrl, query);
        expect(formatedUrl).toEqual(expectedUrl);

        //Test ensures that dynamic content is properly rendered in the url
        myUrl = "http://www.mydomain.com/test/{name}/{another}"
        let dynamicContent = {"name":"test_name", "another":"another_value"};
        expectedUrl = "http://www.mydomain.com/test/test_name/another_value";
        formatedUrl = formatUrl(myUrl, null, dynamicContent);
        expect(formatedUrl).toEqual(expectedUrl);

        //Test ensures that query strings and dynamic contents are properly rendered in the url
        myUrl = "http://www.mydomain.com/test/{name}/{another}"
        dynamicContent = {"name":"test_name", "another":"another_value"};
        query = {"query1":"value1", "query2":"value2"}
        expectedUrl = "http://www.mydomain.com/test/test_name/another_value?query1=value1&query2=value2";
        formatedUrl = formatUrl(myUrl, query, dynamicContent);
        expect(formatedUrl).toEqual(expectedUrl);
    })
})