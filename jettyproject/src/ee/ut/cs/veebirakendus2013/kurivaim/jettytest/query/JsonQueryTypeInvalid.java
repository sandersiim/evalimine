package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class JsonQueryTypeInvalid implements JsonQueryInterface {
	public static final int realQueryId = -1;
	
	public int errorId;
	public String errorString;
	
	public JsonQueryTypeInvalid(int errorId, String errorString) {
		this.errorId = errorId;
		this.errorString = errorString;
	}
	
	@Override
	public JsonResponseInterface processQuery(HttpServletRequest request, HttpServletResponse response) {
		return new JsonResponseStatus(errorId, errorString);
	}
}
