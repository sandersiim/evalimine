package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import java.util.List;

import com.google.gson.annotations.SerializedName;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryUserInfo;

public class JsonResponseTypeUserList implements JsonResponseInterface {
	@SerializedName("responseType")
	private final String responseType = "userList";
	
	@SerializedName("userList")
	private List<MysqlQueryUserInfo> userList;
	
	public JsonResponseTypeUserList(List<MysqlQueryUserInfo> userList) throws NullPointerException {
		this.userList = userList;
		
		//argument must not be null
		if(userList == null) throw new NullPointerException();
	}
}
