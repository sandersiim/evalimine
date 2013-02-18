package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryUserInfo;

public class JsonQueryTypeAdminUsers implements JsonQueryInterface {
	
	private int regionId;

	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		try {
			if(!queryInfo.isLoggedInAsAdmin()) {
				return new JsonResponseTypeStatus(1, "adminUserList", "Error - not logged in as admin.");
			}
			
			MysqlConnectionHandler sqlHandler = queryInfo.getSqlHandler();
			
			if(!sqlHandler.validateConnection()) {
				return new JsonResponseTypeStatus(-1, "adminUserList", "Error - no database connection.");
			}
			
			return new JsonResponseTypeUserList(new MysqlQueryUserInfo(sqlHandler).queryAllByFilter(regionId));
		}
		catch(Exception e) {
			//TODO: when logging system is present, log this error
			e.printStackTrace();
			
			return new JsonResponseTypeStatus(-1, "adminUserList", "Unknown error.");
		}
	}
}
