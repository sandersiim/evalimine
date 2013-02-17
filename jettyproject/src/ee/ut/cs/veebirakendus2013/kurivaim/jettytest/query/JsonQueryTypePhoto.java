package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import java.io.File;

import com.google.gson.annotations.SerializedName;

public class JsonQueryTypePhoto implements JsonQueryInterface {
	
	@SerializedName("username")
	private String userName;
	
	@SerializedName("password")
	private String password;

	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		try {
			int userId = queryInfo.getLoggedInUserId();
			
			if(userId == 0) {
				return new JsonResponseTypeStatus(1, "photoAction", "Photo upload failed - not logged in.");
			}
			else {
				Object imageFileObject = queryInfo.getRequest().getAttribute("imageFile");
				String imageSourceName = queryInfo.getRequest().getParameter("imageFile");
				
				if(imageFileObject == null || !(imageFileObject instanceof File)) {
					return new JsonResponseTypeStatus(1, "photoAction", "Photo upload failed - no image included.");
				}
				else {
					File imageFile = (File)imageFileObject;
					
					if(!imageSourceName.endsWith(".jpg")) {
						return new JsonResponseTypeStatus(2, "photoAction", "Photo upload failed - must be a .jpg file.");
					}
					else if(imageFile.length() > 1048576) {
						return new JsonResponseTypeStatus(3, "photoAction", "Photo upload failed - larger than 1MB.");
					}
					else {
						imageFile.renameTo(new File("../html/userimg/" + userId + ".jpg"));
						
						return new JsonResponseTypeStatus(10, "photoAction", "Photo successfully uploaded.");
					}
				}
			}
		}
		catch(Exception e) {
			e.printStackTrace(); //TODO: log
			
			return new JsonResponseTypeStatus(-1, "photoAction", "Photo upload failed - unknown error.");
		}
	}
}
