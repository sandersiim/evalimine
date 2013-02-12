package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

public class JsonQueryHandler {
	Map<String, Class<? extends JsonQueryInterface>> queryClassList;
	
	public JsonQueryHandler() {
		queryClassList = new HashMap<String, Class<? extends JsonQueryInterface>>();
		
		addQueryType(JsonQueryTypeLogin.class);
		addQueryType(JsonQueryTypeStatus.class);
	}
	
	public void addQueryType(Class<? extends JsonQueryInterface> classToAdd) {
		try {
			Object queryType = classToAdd.getDeclaredField("realQueryType").get(null);
			
			if(queryType instanceof String && ((String)queryType).length() > 0) {
				queryClassList.put((String)queryType, classToAdd);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void processInputJson(String jsonString, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
		response.setStatus(HttpServletResponse.SC_OK);
		
		JsonQueryInterface jsonQuery = null;
		int errorIndex = 1;
		String errorString = "Malformed query.";
		
		Gson gson = new Gson();
		
		if(jsonString != null) {
			try {
				JsonQueryTypeBase queryBase = gson.fromJson(jsonString, JsonQueryTypeBase.class);
				
				if(queryBase == null) {
					throw new IOException("Unable to parse into base query.");
				}
				
				Class<? extends JsonQueryInterface> classToParse = queryClassList.get(queryBase.queryType);
				
				if(classToParse == null) {
					throw new IOException("Unknown query ID.");
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
		
		JsonResponseInterface responseData = jsonQuery.processQuery(request, response);
		String outputJson = gson.toJson(responseData);
		
		response.getWriter().println(outputJson);
	}
}

