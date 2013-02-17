package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Iterator;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;

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
				
				if(imageFileObject == null || !(imageFileObject instanceof File)) {
					return new JsonResponseTypeStatus(1, "photoAction", "Photo upload failed - no image included.");
				}
				else {
					File imageFile = (File)imageFileObject;
					
					if(imageFile.length() > 262144) {
						return new JsonResponseTypeStatus(3, "photoAction", "Photo upload failed - larger than 256KB.");
					}
					else {
						BufferedImage image = getJpegImage(imageFile);
						
						if(image == null) {
							return new JsonResponseTypeStatus(3, "photoAction", "Photo upload failed - not a valid JPEG image.");
						}
						else if(image.getHeight() < 100 || image.getWidth() < 100) {
							return new JsonResponseTypeStatus(3, "photoAction", "Photo upload failed - dimensions must be at least 100x100.");
						}
						else {
							imageFile.renameTo(new File("../html/userimg/" + userId + ".jpg"));
							
							return new JsonResponseTypeStatus(10, "photoAction", "Photo successfully uploaded.");
						}
					}
				}
			}
		}
		catch(Exception e) {
			e.printStackTrace(); //TODO: log
			
			return new JsonResponseTypeStatus(-1, "photoAction", "Photo upload failed - unknown error.");
		}
	}
	
	public BufferedImage getJpegImage(File imageFile) {
		ImageInputStream stream = null;
		ImageReader reader = null;
		
		try {
			Iterator<ImageReader> readers = ImageIO.getImageReadersByMIMEType("image/jpeg");
			
			if(!readers.hasNext()) {
				return null;
			}
			
			reader = readers.next();
			stream = ImageIO.createImageInputStream(imageFile);
			
			if(stream == null) {
				return null;
			}
			
			reader.setInput(stream, true, true);
			
			BufferedImage image = reader.read(0, reader.getDefaultReadParam());
			
			return image;
		}
		catch(Exception e) {
			return null;
		}
		finally {
			if(stream != null) {
				try {
					stream.close();
				} catch (IOException e) {
					e.printStackTrace(); // TODO: Auto-generated catch block
				}
			}
			
			if(reader != null) {
				reader.dispose();
			}
		}
	}
}
