package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import com.google.gson.annotations.SerializedName;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryCandidateInfo;

public class JsonQueryTypeCandidates implements JsonQueryInterface {
	
	@SerializedName("regionId")
	private int regionId;
	
	@SerializedName("partyId")
	private int partyId;
	
	@SerializedName("namePrefix")
	private String namePrefix;

	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		try {
			MysqlConnectionHandler sqlHandler = queryInfo.getSqlHandler();
			
			if(!sqlHandler.validateConnection()) {
				return new JsonResponseTypeStatus(-1, "candidateList", "Fetching candidate list failed - no database connection.");
			}
			
			return new JsonResponseTypeCandidates(new MysqlQueryCandidateInfo(queryInfo.getSqlHandler()).queryAllByFilter(regionId, partyId, namePrefix, 0));
		}
		catch(Exception e) {
			//TODO: when logging system is present, log this error
			e.printStackTrace();
			
			return new JsonResponseTypeStatus(-1, "candidateList", "Fetching candidate list failed - unknown error.");
		}
	}
}
