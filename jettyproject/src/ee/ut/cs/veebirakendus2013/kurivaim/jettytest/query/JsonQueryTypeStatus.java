package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.annotations.SerializedName;

public class JsonQueryTypeStatus implements JsonQueryInterface {
	public static final int realQueryId = 3;
	
	@SerializedName("queryId")
	public int queryId;

	@Override
	public JsonResponseInterface processQuery(HttpServletRequest request, HttpServletResponse response) {
		Object userName = request.getSession().getAttribute("username");
		
		if(userName != null && userName instanceof String) {
			return new JsonResponseTypeText("Logged in as '" + ((String)userName) + "'.");
		}
		else {
			return new JsonResponseTypeText("Not logged in.");
		}
	}
}
