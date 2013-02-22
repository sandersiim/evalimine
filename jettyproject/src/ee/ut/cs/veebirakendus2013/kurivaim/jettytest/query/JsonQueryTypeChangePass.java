package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import java.sql.PreparedStatement;
import java.sql.SQLException;

import com.google.gson.annotations.SerializedName;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryUserInfo;

public class JsonQueryTypeChangePass implements JsonQueryInterface {
	
	@SerializedName("oldPassword")
	private String oldPassword;
	
	@SerializedName("newPassword")
	private String newPassword;
	
	@SerializedName("newPasswordRepeat")
	private String newPasswordRepeat;

	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		try {
			MysqlConnectionHandler sqlHandler = queryInfo.getSqlHandler();
			
			if(!sqlHandler.validateConnection()) {
				return new JsonResponseTypeStatus(-1, "changePass", "Error - no database connection.");
			}
			
			MysqlQueryUserInfo userInfo = queryInfo.getLoggedInUserInfo();
			
			if(userInfo == null) {
				return new JsonResponseTypeStatus(1, "changePass", "Error - not logged in.");
			}
			else if(newPassword == null || newPassword.length() < 5) {
				return new JsonResponseTypeStatus(2, "changePass", "Error - new password length below 5.");
			}
			else if(!newPassword.equals(newPasswordRepeat)) {
				return new JsonResponseTypeStatus(3, "changePass", "Error - new passwords don't match.");
			}
			else {
				String oldHash = sqlHandler.getPasswordHash(oldPassword);
				String newHash = sqlHandler.getPasswordHash(newPassword);
				boolean oldPasswordRequired = (queryInfo.getSessionStringParameter("firstName") == null);
				
				int affected = -1;
				
				try {
					PreparedStatement statement = sqlHandler.getConnection().prepareStatement(
							"UPDATE ev_users SET password = ? WHERE id = ? " + (oldPasswordRequired ? " AND password = ?" : ""));
					
					statement.setString(1, newHash);
					statement.setInt(2, userInfo.getUserId());
					
					if(oldPasswordRequired) statement.setString(3, oldHash);
					
					affected = statement.executeUpdate();
				}
				catch(SQLException e) {
					e.printStackTrace(); //TODO: log this error
				}
				
				if(affected == -1) {
					return new JsonResponseTypeStatus(-1, "changePass", "Error - database query error.");
				}
				else if(affected == 0) {
					return new JsonResponseTypeStatus(4, "changePass", "Error - old password is wrong.");
				}
				else {
					return new JsonResponseTypeStatus(10, "changePass", "Successfully changed password.");
				}
			}
		}
		catch(Exception e) {
			e.printStackTrace(); //TODO: when logging system is present, log this error
			
			return new JsonResponseTypeStatus(-1, "changePass", "Login failed - unknown error.");
		}
	}
}
