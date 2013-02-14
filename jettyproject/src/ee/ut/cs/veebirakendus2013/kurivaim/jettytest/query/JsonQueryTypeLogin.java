package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.servlet.http.HttpSession;

import com.google.gson.annotations.SerializedName;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;

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
				//for testing purposes
				if(userName.equals("offlinelogin") && password.equals("testpass")) {
					session.setAttribute("username", userName);
					
					return new JsonResponseTypeStatus(2, "loginAction", "Successfully logged in.");
				}
				
				return new JsonResponseTypeStatus(-1, "loginAction", "Login failed - no database connection.");
			}
			
			PreparedStatement statement = sqlHandler.getConnection().prepareStatement("SELECT username FROM ev_users WHERE username = ? AND password = ?");
			statement.setString(1, userName);
			statement.setString(2, sqlHandler.getPasswordHash(password));
			ResultSet results = statement.executeQuery();
			
			if(results.next()) {
				session.setAttribute("username", userName);
	
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
