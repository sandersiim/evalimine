package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.annotations.SerializedName;

public class JsonQueryTypeBase implements JsonQueryInterface {
	public static final int realQueryId = -1;
	
	@SerializedName("queryId")
	public int queryId;

	@Override
	public JsonResponseInterface processQuery(HttpServletRequest request, HttpServletResponse response) {
		return new JsonResponseTypeText("Base class!?");
	}
}
