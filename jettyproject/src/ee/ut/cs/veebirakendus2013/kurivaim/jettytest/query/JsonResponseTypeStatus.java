package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import com.google.gson.annotations.SerializedName;

public class JsonResponseTypeStatus implements JsonResponseInterface {
	@SerializedName("responseType")
	public final String responseType = "status";
	
	@SerializedName("statusCode")
	public int statusCode;
	
	@SerializedName("statusComponent")
	public String statusComponent;
	
	@SerializedName("statusMessage")
	public String statusMessage;
	
	public JsonResponseTypeStatus(int statusCode, String statusComponent, String statusMessage) {
		this.statusCode = statusCode;
		this.statusComponent = statusComponent;
		this.statusMessage = statusMessage;
	}
}
