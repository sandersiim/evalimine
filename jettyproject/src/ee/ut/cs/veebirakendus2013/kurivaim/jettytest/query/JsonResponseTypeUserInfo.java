package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import com.google.gson.annotations.SerializedName;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryCandidateInfo;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryUserInfo;

public class JsonResponseTypeUserInfo implements JsonResponseInterface {
	@SerializedName("responseType")
	private final String responseType = "userInfo";
	
	@SerializedName("reason")
	private final String reason;
	
	@SerializedName("userInfo")
	private final MysqlQueryUserInfo userInfo;
	
	@SerializedName("candidateInfo")
	private final MysqlQueryCandidateInfo candidateInfo;
	
	@SerializedName("cardFirstName")
	private final String cardFirstName;
	
	@SerializedName("cardLastName")
	private final String cardLastName;
	
	public JsonResponseTypeUserInfo(String reason, MysqlQueryUserInfo userInfo, MysqlQueryCandidateInfo candidateInfo, String cardFirstName, String cardLastName) {
		this.reason = reason;
		this.userInfo = userInfo;
		this.candidateInfo = candidateInfo;
		this.cardFirstName = cardFirstName;
		this.cardLastName = cardLastName;
	}
}
