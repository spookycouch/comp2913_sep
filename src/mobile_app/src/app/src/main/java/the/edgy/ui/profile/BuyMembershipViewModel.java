package the.edgy.ui.profile;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class BuyMembershipViewModel extends ViewModel {

    private MutableLiveData<String> mText;

    public BuyMembershipViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("This is buy membership fragment");
    }

    public LiveData<String> getText() {
        return mText;
    }
}
