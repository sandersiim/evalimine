package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;

public class JsonQueryInfo {
	
	private final String jsonString;
	private final String queryTypeName;
	private final HttpServletRequest request;
	private final HttpServletResponse response;
	private final JsonQueryHandler queryHandler;
	private final MysqlConnectionHandler sqlHandler;
	private final boolean isPostQuery;
	
	public JsonQueryInfo(HttpServletRequest request, HttpServletResponse response, JsonQueryHandler queryHandler, MysqlConnectionHandler sqlHandler) {
		this.request = request;
		this.response = response;
		this.queryHandler = queryHandler;
		this.sqlHandler = sqlHandler;
		
		isPostQuery = request.getMethod().equals("POST");
		
		String[] jsonData = request.getParameterMap().get("json");
		
		if(jsonData != null && jsonData.length > 0 && jsonData[0] != null) {
			jsonString = jsonData[0];
		}
		else {
			jsonString = "{}";
		}
		
		queryTypeName = request.getPathInfo().substring(1);
	}
	
	public void processQuery() throws ServletException, IOException {
		response.setContentType("application/json");
		response.setStatus(HttpServletResponse.SC_OK);
		
		JsonQueryInterface jsonQuery = null;
		int errorIndex = 1;
		String errorString = "Malformed query.";
		
		Gson gson = new Gson();
		
		if(jsonString != null) {
			try {
				Class<? extends JsonQueryInterface> classToParse = queryHandler.findQueryClass(isPostQuery, queryTypeName);
				
				if(classToParse == null) {
					throw new IOException("Unknown query type for this request method.");
				}
				
				jsonQuery = gson.fromJson(jsonString, classToParse);
			}
			catch(Exception e) {
				errorString = e.getMessage();
			}
		}
		
		if(jsonQuery == null) {
			jsonQuery = new JsonQueryTypeInvalid(errorIndex, errorString);
		}
		
		JsonResponseInterface responseData = jsonQuery.processQuery(this);
		String outputJson = gson.toJson(responseData);
		
		response.getWriter().println(outputJson);
	}
	
	public HttpServletRequest getRequest() {
		return request;
	}

	public HttpServletResponse getResponse() {
		return response;
	}
	
	public MysqlConnectionHandler getSqlHandler() {
		return sqlHandler;
	}
}
