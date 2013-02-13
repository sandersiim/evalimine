package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import com.google.gson.annotations.SerializedName;

public class JsonResponseTypeStatus implements JsonResponseInterface {
	@SerializedName("responseType")
	private final String responseType = "status";
	
	@SerializedName("statusCode")
	private int statusCode;
	
	@SerializedName("statusComponent")
	private String statusComponent;
	
	@SerializedName("statusMessage")
	private String statusMessage;
	
	public JsonResponseTypeStatus(int statusCode, String statusComponent, String statusMessage) {
		this.statusCode = statusCode;
		this.statusComponent = statusComponent;
		this.statusMessage = statusMessage;
	}
}
