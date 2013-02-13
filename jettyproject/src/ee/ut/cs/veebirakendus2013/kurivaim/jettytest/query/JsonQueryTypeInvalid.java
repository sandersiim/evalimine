package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class JsonQueryTypeInvalid implements JsonQueryInterface {
	
	public int errorId;
	public String errorString;
	
	public JsonQueryTypeInvalid(int errorId, String errorString) {
		this.errorId = errorId;
		this.errorString = errorString;
	}
	
	@Override
	public JsonResponseInterface processQuery(HttpServletRequest request, HttpServletResponse response) {
		return new JsonResponseTypeStatus(-errorId, "generic", errorString);
	}
	
}
