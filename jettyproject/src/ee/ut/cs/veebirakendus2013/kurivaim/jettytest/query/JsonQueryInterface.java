package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface JsonQueryInterface {
	
	public JsonResponseInterface processQuery(HttpServletRequest request, HttpServletResponse response);

}
