package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.annotations.SerializedName;

public class JsonQueryTypeBase implements JsonQueryInterface {
	
	@SerializedName("queryType")
	public String queryType;

	@Override
	public JsonResponseInterface processQuery(HttpServletRequest request, HttpServletResponse response) {
		return new JsonResponseTypeText("Base class!?");
	}
	
}
