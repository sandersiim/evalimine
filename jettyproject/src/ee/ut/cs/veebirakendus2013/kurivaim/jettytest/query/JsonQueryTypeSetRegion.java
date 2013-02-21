package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryUserInfo;

public class JsonQueryTypeSetRegion implements JsonQueryInterface {
	
	int regionId;
	
	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		try {
			MysqlConnectionHandler sqlHandler = queryInfo.getSqlHandler();
			
			if(!sqlHandler.validateConnection()) {
				return new JsonResponseTypeStatus(-1, "setRegionAction", "Set region failed - no database connection.");
			}
			
			MysqlQueryUserInfo userInfo = queryInfo.getLoggedInUserInfo();
			
			if(userInfo == null) {
				return new JsonResponseTypeStatus(1, "setRegionAction", "Set region failed - not logged in.");
			}
			else if(userInfo.getVoteRegionId() != 0) {
				return new JsonResponseTypeStatus(2, "setRegionAction", "Set region failed - already defined.");
			}
			else {
				int affected = sqlHandler.simpleUpdateQuery(
						"UPDATE ev_users SET voteRegionId = " + regionId + " WHERE id = " + userInfo.getUserId() + " AND " +
						"voteRegionId = " + 0 + " AND 0 < (SELECT COUNT(*) FROM ev_regions WHERE id = " + regionId + ")");
				
				if(affected == -1) {
					return new JsonResponseTypeStatus(-1, "setRegionAction", "Set region failed - database query error.");
				}
				else if(affected == 0) {
					return new JsonResponseTypeStatus(3, "setRegionAction", "Set region failed - no such region.");
				}
				else {
					return new JsonResponseTypeStatus(10, "setRegionAction", "Region successfully set.");
				}
			}
		}
		catch(Exception e) {
			e.printStackTrace(); //TODO: when logging system is present, log this error
			
			return new JsonResponseTypeStatus(-1, "setRegionAction", "Set region failed - unknown error.");
		}
	}
}
