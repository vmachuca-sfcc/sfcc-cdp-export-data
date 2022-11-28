public class GoogleStorageService {

    private static String Bucket = 'vmachuca-b2c-zzeh009';

    public static void uploadCustomersFile() {
        List<ContentVersion> items = [
            SELECT Id, VersionData
            FROM ContentVersion
            WHERE Title LIKE '%customers%' ORDER BY CreatedDate DESC LIMIT 1
        ];
        if(items.isEmpty()) return;
        ContentVersion cv = items[0];

        HttpRequest request = new HttpRequest();
        request.setMethod('POST');
        request.setEndpoint('callout:Google_Storage/upload/storage/v1/b/'+ Bucket + '/o?name=customers.csv');
		request.setBodyAsBlob(cv.VersionData);

        Http http = new Http();
        HTTPResponse response = http.send(request);

        System.debug(response.getBody());
        if (response.getStatusCode() == 200) {
            System.debug(response.getBody());
        }
    }

    public static void testCallout() {
        HttpRequest request = new HttpRequest();
        request.setMethod('GET');
        request.setEndpoint('callout:Google_Storage' + '/oauthplayground/TestFolder/HelloWorld.txt');

        Http http = new Http();
        HTTPResponse response = http.send(request);

        System.debug(response.getBody());
    }
}