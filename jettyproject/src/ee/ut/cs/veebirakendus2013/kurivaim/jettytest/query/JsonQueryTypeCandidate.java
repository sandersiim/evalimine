package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryCandidateInfo;


public class JsonQueryTypeCandidate implements JsonQueryInterface {
	
	private int candidateId;
	
	
	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		try {
			MysqlConnectionHandler sqlHandler = queryInfo.getSqlHandler();
			
			if ( !sqlHandler.validateConnection() ) {
				return new JsonResponseTypeStatus( -1, "candidate", "Fetching candidate info failed - no database connection.");
			}
			
			return new JsonResponseTypeCandidate(new MysqlQueryCandidateInfo(sqlHandler).querySingleByCandidateId(candidateId));
		} catch (Exception e) {
			// TODO: when logging system is present, log this error
			e.printStackTrace();
			
			return new JsonResponseTypeStatus( -1, "candidate", "Fetching candidate info failed - unknown error.");
		}
	}
	
}
