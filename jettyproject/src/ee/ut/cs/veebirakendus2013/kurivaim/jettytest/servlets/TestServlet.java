package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query.JsonQueryHandler;

public class TestServlet extends HttpServlet {
	private static final long serialVersionUID = 4822041841146535386L;
	
	private JsonQueryHandler queryHandler;
	
	public TestServlet() {
		queryHandler = new JsonQueryHandler();
	}
	
	public TestServlet(String greeting) {
		
	}
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String[] jsonData = request.getParameterMap().get("jsonData");
		
		if(jsonData != null && jsonData.length > 0 && jsonData[0] != null) {
			queryHandler.processInputJson(jsonData[0], request, response);
		}
		else {
			queryHandler.processInputJson(null, request, response);
		}
	}
}
