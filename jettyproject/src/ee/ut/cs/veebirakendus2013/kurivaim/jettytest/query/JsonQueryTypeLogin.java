package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import javax.servlet.http.HttpSession;

import com.google.gson.annotations.SerializedName;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryUserInfo;

public class JsonQueryTypeLogin implements JsonQueryInterface {
	
	@SerializedName("username")
	private String userName;
	
	@SerializedName("password")
	private String password;

	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		try {
			MysqlConnectionHandler sqlHandler = queryInfo.getSqlHandler();
			HttpSession session = queryInfo.getRequest().getSession();
			
			if(!sqlHandler.validateConnection()) {
				return new JsonResponseTypeStatus(-1, "loginAction", "Login failed - no database connection.");
			}
			
			MysqlQueryUserInfo userInfo = new MysqlQueryUserInfo(queryInfo.getSqlHandler()).querySingleByUserAndPass(userName, password);
			
			if(userInfo != null) {
				session.setAttribute("username", userInfo.getUsername());
	
				return new JsonResponseTypeStatus(2, "loginAction", "Successfully logged in.");
			}
		
			return new JsonResponseTypeStatus(1, "loginAction", "Login failed - wrong username or password.");
		}
		catch(Exception e) {
			//TODO: when logging system is present, log this error
			e.printStackTrace();
			
			return new JsonResponseTypeStatus(-1, "loginAction", "Login failed - unknown error.");
		}
	}
}
