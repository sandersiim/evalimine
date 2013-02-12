package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import com.google.gson.annotations.SerializedName;

public class JsonResponseTypeText implements JsonResponseInterface {
	@SerializedName("responseId")
	public final int responseId = 2;
	
	@SerializedName("responseText")
	public String responseText;
	
	public JsonResponseTypeText(String responseText) {
		this.responseText = responseText;
	}
}
