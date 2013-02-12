package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.annotations.SerializedName;

public class JsonQueryTypeLogin implements JsonQueryInterface {
	public static final int realQueryId = 1;
	
	@SerializedName("queryId")
	public int queryId;
	
	@SerializedName("username")
	public String userName;
	
	@SerializedName("password")
	public String password;

	@Override
	public JsonResponseInterface processQuery(HttpServletRequest request, HttpServletResponse response) {
		if(userName.equals("testuser") && password.equals("testpass")) {
			request.getSession().setAttribute("username", userName);
			
			return new JsonResponseTypeText("Login successful.");
		}
		
		return new JsonResponseTypeText("Wrong username or password.");
	}
}
