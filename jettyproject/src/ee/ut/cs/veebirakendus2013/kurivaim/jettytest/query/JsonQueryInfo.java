package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryCandidateInfo;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryUserInfo;

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
	
	public void processQuery() {
		response.setContentType("application/json");
		response.setStatus(HttpServletResponse.SC_OK);
		
		JsonQueryInterface jsonQuery = null;
		int errorIndex = 1;
		String errorString = "Malformed query.";
		
		Gson gson = new GsonBuilder().serializeNulls().create();
		
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
		
		try {
			response.getWriter().println(outputJson);
		}
		catch(IOException e) {
			e.printStackTrace(); //TODO: log this error
		}
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
	
	public boolean isLoggedInAsAdmin() {
		Object idObject = request.getSession().getAttribute("userId");
		
		if(idObject != null && idObject instanceof Integer) {
			Integer id = (Integer)idObject;
			
			return (id == -1);
		}
		
		return false;
	}
	
	public int getLoggedInUserId() {
		Object idObject = request.getSession().getAttribute("userId");
		
		if(idObject != null && idObject instanceof Integer) {
			Integer id = (Integer)idObject;
			
			return (id > 0) ? id : 0;
		}
		
		return 0;
	}
	
	public void setLoggedInUserId(int userId) {
		removeLoggedInUserId();
		
		request.getSession().setAttribute("userId", userId);
	}
	
	public void removeLoggedInUserId() {
		request.getSession().removeAttribute("userId");
		request.getSession().removeAttribute("firstName");
		request.getSession().removeAttribute("lastName");
		request.getSession().removeAttribute("authStatus");
	}
	
	public MysqlQueryUserInfo getLoggedInUserInfo() {
		int userId = getLoggedInUserId();
		
		return (userId > 0) ? new MysqlQueryUserInfo(sqlHandler).querySingleById(userId) : null;
	}
	
	public MysqlQueryCandidateInfo getLoggedInCandidateInfo() {
		int userId = getLoggedInUserId();
		
		return (userId > 0) ? new MysqlQueryCandidateInfo(sqlHandler).querySingleByUserId(userId) : null;
	}
	
	public String getAuthStatus() {
		Object authStatusObject = request.getSession().getAttribute("authStatus");
		
		if(authStatusObject != null && authStatusObject instanceof String) {
			return (String)authStatusObject;
		}
		
		return null;
	}
}
