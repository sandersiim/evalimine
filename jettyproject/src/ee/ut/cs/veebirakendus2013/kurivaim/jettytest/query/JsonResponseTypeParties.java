package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import java.util.List;

import com.google.gson.annotations.SerializedName;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryPartyInfo;

public class JsonResponseTypeParties implements JsonResponseInterface {
	@SerializedName("responseType")
	private final String responseType = "parties";
	
	@SerializedName("partyList")
	private List<MysqlQueryPartyInfo> partyList;
	
	public JsonResponseTypeParties(List<MysqlQueryPartyInfo> partyList) throws NullPointerException {
		this.partyList = partyList;
		
		//argument must not be null
		if(partyList == null) throw new NullPointerException();
	}
}
