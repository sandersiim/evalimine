package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.annotations.SerializedName;

public class JsonQueryTypeStatus implements JsonQueryInterface {
	public static final String realQueryType = "status";
	
	@SerializedName("queryType")
	public String queryType;

	@Override
	public JsonResponseInterface processQuery(HttpServletRequest request, HttpServletResponse response) {
		Object userName = request.getSession().getAttribute("username");
		
		if(userName != null && userName instanceof String) {
			return new JsonResponseTypeStatus(2, "loginStatus", "Logged in as '" + ((String)userName) + "'.");
		}
		else {
			return new JsonResponseTypeStatus(1, "loginStatus", "Not logged in");
		}
	}
}
