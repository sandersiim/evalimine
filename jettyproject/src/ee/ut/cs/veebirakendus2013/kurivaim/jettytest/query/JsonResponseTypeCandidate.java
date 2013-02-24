package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import com.google.gson.annotations.SerializedName;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryCandidateInfo;


public class JsonResponseTypeCandidate implements JsonResponseInterface {
	
	@SerializedName("responseType")
	private final String responseType = "candidate";
	
	@SerializedName("candidateInfo")
	private MysqlQueryCandidateInfo candidateInfo;
	
	
	public JsonResponseTypeCandidate(MysqlQueryCandidateInfo candidateInfo) throws NullPointerException {
		this.candidateInfo = candidateInfo;
		
		// argument must not be null
		if ( candidateInfo == null ) throw new NullPointerException();
	}
	
}
