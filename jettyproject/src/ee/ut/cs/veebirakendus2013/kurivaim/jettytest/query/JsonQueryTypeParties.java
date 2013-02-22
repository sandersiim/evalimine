package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryPartyInfo;

public class JsonQueryTypeParties implements JsonQueryInterface {
	
	private int regionId;
	private int orderId;

	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		try {
			MysqlConnectionHandler sqlHandler = queryInfo.getSqlHandler();
			
			if(!sqlHandler.validateConnection()) {
				return new JsonResponseTypeStatus( -1, "partyList", "Fetching party list failed - no database connection.");
			}
			
			return new JsonResponseTypeParties(new MysqlQueryPartyInfo(sqlHandler).queryAllByFilter(regionId, orderId));
		}
		catch(Exception e) {
			//TODO: when logging system is present, log this error
			e.printStackTrace();
			
			return new JsonResponseTypeStatus( -1, "partyList", "Fetching party list failed - unknown error.");
		}
	}
}
