package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import com.google.gson.annotations.SerializedName;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryRegionInfo;


public class JsonQueryTypeRegions implements JsonQueryInterface {
	
	@SerializedName("resultMethod")
	int resultMethod;
	
	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		try {
			MysqlConnectionHandler sqlHandler = queryInfo.getSqlHandler();
			
			if(!sqlHandler.validateConnection()) {
				return new JsonResponseTypeStatus(-1, "regionList", "Fetching region list failed - no database connection.");
			}
			
			if(resultMethod == 1) {
				return new JsonResponseTypeRegions(new MysqlQueryRegionInfo(sqlHandler).queryAllWithCounts());
			}
			else {
				return new JsonResponseTypeRegions(new MysqlQueryRegionInfo(sqlHandler).queryAll());
			}
		}
		catch(Exception e) {
			//TODO: when logging system is present, log this error
			e.printStackTrace();
			
			return new JsonResponseTypeStatus(-1, "regionList", "Fetching region list failed - unknown error.");
		}
	}
	
}
