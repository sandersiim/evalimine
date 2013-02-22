package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import java.util.List;

import com.google.gson.annotations.SerializedName;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryRegionInfo;


public class JsonResponseTypeRegions implements JsonResponseInterface {
	
	@SerializedName("responseType")
	private final String responseType = "regions";
	
	@SerializedName("regionList")
	private List<MysqlQueryRegionInfo> regionList;
	
	
	public JsonResponseTypeRegions(List<MysqlQueryRegionInfo> regionList) throws NullPointerException {
		this.regionList = regionList;

		// argument must not be null
		if ( regionList == null ) throw new NullPointerException();
	}
}
