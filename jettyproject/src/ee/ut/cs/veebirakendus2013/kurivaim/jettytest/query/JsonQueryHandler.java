package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

import java.util.HashMap;
import java.util.Map;

public class JsonQueryHandler {
	
	private Map<String, Class<? extends JsonQueryInterface>> queryClassesForGet;
	private Map<String, Class<? extends JsonQueryInterface>> queryClassesForPost;
	
	public JsonQueryHandler() {
		queryClassesForGet = new HashMap<String, Class<? extends JsonQueryInterface>>();
		queryClassesForPost = new HashMap<String, Class<? extends JsonQueryInterface>>();
		
		initQueries();
	}
	
	
	private void initQueries() {
		//GET queries
		addQueryType(false, JsonQueryTypes.STATUS);
		addQueryType(false, JsonQueryTypes.CANDIDATES);
		
		// POST queries (first argument to true to set them in POST mode)
		addQueryType(false, JsonQueryTypes.LOGIN);
	}
	
	
	public void addQueryType(boolean isPostQuery, JsonQueryTypes queryType) {
		if(isPostQuery) {
			queryClassesForPost.put(queryType.getName(), queryType.getImplClass());
		}
		else {
			queryClassesForGet.put(queryType.getName(), queryType.getImplClass());
		}
	}
	
	public Class<? extends JsonQueryInterface> findQueryClass(boolean isPostQuery, String typeName) {
		return isPostQuery ? queryClassesForPost.get(typeName) : queryClassesForGet.get(typeName);
	}
}
