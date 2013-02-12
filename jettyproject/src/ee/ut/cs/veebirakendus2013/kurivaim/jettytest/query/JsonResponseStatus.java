package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import com.google.gson.annotations.SerializedName;

public class JsonResponseStatus implements JsonResponseInterface {
	@SerializedName("responseId")
	public final int responseId = 1;
	
	@SerializedName("errorId")
	public int statusId;
	
	@SerializedName("errorString")
	public String statusMessage;
	
	public JsonResponseStatus(int statusId, String statusMessage) {
		this.statusId = statusId;
		this.statusMessage = statusMessage;
	}
}
