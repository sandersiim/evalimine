package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query.JsonQueryHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query.JsonQueryInfo;

public class TestServlet extends HttpServlet {
	private static final long serialVersionUID = 4822041841146535386L;
	
	private final JsonQueryHandler queryHandler;
	private final MysqlConnectionHandler sqlHandler;
	
	public TestServlet() {
		queryHandler = new JsonQueryHandler();
		sqlHandler = new MysqlConnectionHandler();
	}
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JsonQueryInfo queryInfo = new JsonQueryInfo(request, response, queryHandler, sqlHandler);
		
		queryInfo.processQuery();
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JsonQueryInfo queryInfo = new JsonQueryInfo(request, response, queryHandler, sqlHandler);
		
		queryInfo.processQuery();
	}
}
