package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryCandidateInfo;

public class JsonQueryTypeCandidates implements JsonQueryInterface {
	
	private int regionId;
	private int partyId;
	private String namePrefix;
	private int orderId;
	private int startIndex;
	private int count;

	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		try {
			MysqlConnectionHandler sqlHandler = queryInfo.getSqlHandler();
			
			if(!sqlHandler.validateConnection()) {
				return new JsonResponseTypeStatus(-1, "candidateList", "Fetching candidate list failed - no database connection.");
			}
			
			return new JsonResponseTypeCandidates(new MysqlQueryCandidateInfo(sqlHandler).queryAllByFilter(regionId, partyId, namePrefix, orderId, startIndex, count));
		}
		catch(Exception e) {
			//TODO: when logging system is present, log this error
			e.printStackTrace();
			
			return new JsonResponseTypeStatus(-1, "candidateList", "Fetching candidate list failed - unknown error.");
		}
	}
}
