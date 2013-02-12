package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import java.util.HashMap;
import java.util.Map;

public class JsonQueryHandler {
	Map<String, Class<? extends JsonQueryInterface>> queryClassesForGet;
	Map<String, Class<? extends JsonQueryInterface>> queryClassesForPost;
	
	public JsonQueryHandler() {
		queryClassesForGet = new HashMap<String, Class<? extends JsonQueryInterface>>();
		queryClassesForPost = new HashMap<String, Class<? extends JsonQueryInterface>>();
		
		//GET queries
		addQueryType(false, JsonQueryTypeStatus.realQueryType, JsonQueryTypeStatus.class);
		
		//POST queries (first argument to true to set them in POST mode)
		addQueryType(false, JsonQueryTypeLogin.realQueryType, JsonQueryTypeLogin.class);
	}
	
	public void addQueryType(boolean isPostQuery, String queryName, Class<? extends JsonQueryInterface> classToAdd) {
		if(isPostQuery) {
			queryClassesForGet.put((String)queryName, classToAdd);
		}
		else {
			queryClassesForGet.put((String)queryName, classToAdd);
		}
	}
	
	public Class<? extends JsonQueryInterface> findQueryClass(boolean isPostQuery, String typeName) {
		return isPostQuery ? queryClassesForPost.get(typeName) : queryClassesForGet.get(typeName);
	}
}
