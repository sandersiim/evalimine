package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class TestServlet extends HttpServlet {
	private static final long serialVersionUID = 4822041841146535386L;
	
	private String greeting = "Hello World";
    
    public TestServlet() {
    	
    }
    
    public TestServlet(String greeting) {
        this.greeting = greeting;
    }
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().println("<h1>"+greeting+"</h1>");
        response.getWriter().println("session=" + request.getSession(true).getId());
    }
}
