package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.annotations.SerializedName;

public class JsonQueryTypeLogin implements JsonQueryInterface {
	
	@SerializedName("username")
	public String userName;
	
	@SerializedName("password")
	public String password;

	@Override
	public JsonResponseInterface processQuery(HttpServletRequest request, HttpServletResponse response) {
		if(userName.equals("testuser") && password.equals("testpass")) {
			request.getSession().setAttribute("username", userName);
			
			return new JsonResponseTypeStatus(2, "loginAction", "Successfully logged in.");
		}
		
		return new JsonResponseTypeStatus(1, "loginAction", "Login failed - wrong username or password.");
	}
	
}
