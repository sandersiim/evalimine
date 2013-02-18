package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import com.google.gson.annotations.SerializedName;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryAdminInfo;

public class JsonQueryTypeAdminLogin implements JsonQueryInterface {
	
	@SerializedName("adminUsername")
	private String adminUsername;
	
	@SerializedName("adminPassword")
	private String adminPassword;

	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		try {
			MysqlConnectionHandler sqlHandler = queryInfo.getSqlHandler();
			
			if(!sqlHandler.validateConnection()) {
				return new JsonResponseTypeStatus(-1, "adminLoginAction", "Admin login failed - no database connection.");
			}
			
			MysqlQueryAdminInfo adminInfo = new MysqlQueryAdminInfo(queryInfo.getSqlHandler()).querySingleByUserAndPass(adminUsername, adminPassword);
			
			if(adminInfo != null) {
				queryInfo.setLoggedInUserId(-adminInfo.getUserId());
				
				return new JsonResponseTypeStatus(10, "adminLoginAction", "Admin login successful.");
			}
		
			return new JsonResponseTypeStatus(1, "adminLoginAction", "Admin login failed - wrong username or password.");
		}
		catch(Exception e) {
			e.printStackTrace(); //TODO: when logging system is present, log this error
			
			return new JsonResponseTypeStatus(-1, "adminLoginAction", "Admin login failed - unknown error.");
		}
	}
}
